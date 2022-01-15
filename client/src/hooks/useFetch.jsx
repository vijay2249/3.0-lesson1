import { useState, useEffect } from "react";
// import api key
const API_KEY = import.meta.env.API

const useFetch = ({keyword}) =>{
  const [url, setURL] = useState('')

  const fetchGIF = async () =>{
    try{
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`)
      const {data} = await response.json()
      setURL(data[0]?.images?.downsized_medium?.url)
    }catch(err){
      setURL("https://i.pinimg.com/originals/73/d3/a1/73d3a14d212314ab1f7268b71d639c15.gif")
    }
  }
  useEffect(() => {
    if(keyword) fetchGIF()
  }, [keyword])

  return url
}

export default useFetch;