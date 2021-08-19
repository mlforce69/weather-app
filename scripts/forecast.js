const key = 'a0d27c7a1058473989231a68aa7e4208'

const getCity = async (city) => {

    const baseUrl = `http://api.openweathermap.org/data/2.5/weather`
    
    const query = `?q=${city}&appid=${key}`

    const response = await fetch(baseUrl + query)
    const data = await response.json();

    return data
}

getCity('sofia')
.then(data => console.log(data))
.catch(err => console.error(err))

