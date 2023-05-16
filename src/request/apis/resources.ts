import axios from '../config'
import type { ResourcesList } from '~/datas/types/resources'

async function getResources(type: string): Promise<ResourcesList> {
  const res = await axios.get(`/getResources?type=${type}`)
  return res.data.data
}

export { getResources }
