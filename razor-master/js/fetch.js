const backend = 'http://192.168.1.21:3000/'
const myFetch = {
    post: async function (endpoint, data) {
       let response = await fetch(`${backend}${endpoint}`, {
            method: 'POST', 
            mode: 'cors', 
            cache: 'no-cache', 

            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            body: JSON.stringify(data) 
        });
        return response.json()
    } ,
    get: async function (endpoint) {
        let response = await fetch(`${backend}${endpoint}`)
        return response.json()
    }
}

// POST
function postFetch(endpoint, form) {
    return new Promise((resolve, reject) =>  {
        const data = myFetch.post(endpoint, form)
        resolve(data)
    })
}

// GET
function getFetch(endpoint) {
    return new Promise((resolve, reject) => {
        const data = myFetch.get(endpoint)
        resolve(data)
    })
}


export  {postFetch, getFetch} ;



















