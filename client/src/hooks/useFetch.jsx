import { useState, useEffect } from "react";

// import api key
// const API_KEY = import.meta.env.API

const useFetch = ({keyword}) =>{
  const [url, setURL] = useState('')

  const fetchGIF = async () =>{
    try{
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${keyword.split(" ").join("")}&limit=1`)
      const {data} = response.json()
      setURL(data[0]?.images?.downsized_medium?.url)
    }catch(err){
      setGIF("https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284")
    }
  }
  useEffect(() => {
    if(keyword) fetchGIF()
  }, [keyword])

  return url
}

export default useFetch;