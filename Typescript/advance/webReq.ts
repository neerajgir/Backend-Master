import axios, {AxiosResponse} from "axios";

interface Todo {
    userId:number;
    id:number;
    title: string;
    completed: boolean;
} 


// axios.get('https://example.com/data')
// .then(response =>{
//     console.log(response.data)
// })

const fetchData = async () => {
    try {
        const res:AxiosResponse <Todo> = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
        console.log("Todo", res.data)
    } catch (error:any) {
        // console.log("Error", error.message)
        if(axios.isAxiosError(error)){
            console.log("Axios error", error.message)
        }
    }
}

