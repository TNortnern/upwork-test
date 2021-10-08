import axios from 'axios'

const $axios = axios.create({
  baseURL: 'https://www.universal-tutorial.com/api',
})

export default $axios
