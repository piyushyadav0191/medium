import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { CoursesType } from '@/types/global'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import CourseCard from '../cards/course.card'

const SearchInput = ({homeScreen = false}: {homeScreen?: boolean}) => {
    const router = useRouter()
    const [value, setValue] = useState("")
    const [filteredCourses, setFilteredCourses] = useState([])
    const [courses, setCourses] = useState([])

    useEffect(() => {
        axios.get("http://192.168.29.154:8000/api/v1/get-courses")
        .then((res) => {
            console.log(res.data)
            setCourses(res.data.courses)
            if(!homeScreen){
                setFilteredCourses(res.data.courses)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if(homeScreen && value === ""){
            setFilteredCourses([])
        }
        else if(value){
            const filtered = courses.filter((course: CoursesType) => course.name.toLowerCase().includes(value.toLowerCase()))
            setFilteredCourses(filtered)
        }
        else if(!homeScreen){
            setFilteredCourses(courses)
        }
    }, [value, courses])

    const renderCourseItem = ({item}: {item: CoursesType}) => {
     return  <TouchableOpacity style={{backgroundColor: "#fff", padding: 10,
                width: widthPercentageToDP("90%"),
                marginLeft: "1.5%",
                flexDirection: "row"
            }} onPress={() => router.push({
                pathname: "/(routes)/course-details",
                params: {item: JSON.stringify(item)}
            })}>
                <Image source={{uri: item?.thumbnail.url}} style={{width: 60, height: 60, borderRadius: 10}} />
                <Text style={{fontSize: 14,
                    paddingLeft: 10, width: widthPercentageToDP("75%")
                }}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        
    }

  return (
    <View>
      <View style={styles.filteringContainer}>
    <View style={styles.searchContainer}>
    <TextInput style={styles.input} placeholder='Search' value={value} onChangeText={setValue} placeholderTextColor={"#c67cc"} />
    <TouchableOpacity style={styles.searchIconContainer} onPress={() => router.push("/(tabs)/search")}>
        <AntDesign name='search1' size={20} color={"#fff"} />
    </TouchableOpacity>
    </View>
      </View>
      <View style={{paddingHorizontal: 10}}>
        <FlatList data={filteredCourses} keyExtractor={(item: CoursesType) => item._id} renderItem={
            homeScreen ? renderCourseItem : ({item}) => <CourseCard item={item} key={item._id} />
        } />
      </View>
      {
        !homeScreen && (
            <>
            {filteredCourses?.length === 0 && (
                <Text style={{textAlign:"center", paddingTop: 50, fontSize: 20, fontWeight: "600"}}>No data available to show!</Text>
            )}
            </>
        )
      }
    </View>
  )
}

export default SearchInput

const styles = StyleSheet.create({
    filteringContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginTop: 27
    },
    searchContainer: {
        // flex:1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10
    },
    searchIconContainer: {
        width: 36,
        height:36,
        backgroundColor: "#2467ec",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 10,
        width: 271,
        height: 48,
        color: "black"
    },


})