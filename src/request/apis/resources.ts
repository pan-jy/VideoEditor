import axios from '../config'
import type { ResourcesList } from '~/types/resources'

async function getResources(type: string): Promise<ResourcesList> {
  const res = await axios.get(`/getResources?type=${type}`)
  return res.data.data
}

export { getResources }
