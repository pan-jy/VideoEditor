import _axios from 'axios'

const axios = _axios.create({
  baseURL: '/api',
  timeout: 30000
})

// 请求拦截
axios.interceptors.request.use(
  function (config) {
    return config
  },
  async (error) => {
    console.dir(error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  function (response) {
    return response
  },
  async (error) => {
    console.dir(error)
  }
)

export default axios
