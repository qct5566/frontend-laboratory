import { axios } from '@/api/request'

const prefix = '/example'

const api = {
  exampleGet: `${prefix}/exampleGet`,
  examplePost: `${prefix}/examplePost`,
  examplePut: `${prefix}/examplePut`,
  exampleDelete: `${prefix}/exampleDelete`
}

export function exampleGet (params) {
  return axios.get(api.exampleGet, { params })
}

export function examplePost (params) {
  return axios.post(api.examplePost, params)
}

export function examplePut (params) {
  return axios.put(api.examplePut, params)
}

export function exampleDelete (params) {
  return axios.delete(api.exampleDelete, { params })
}
