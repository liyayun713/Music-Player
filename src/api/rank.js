import { commonParams } from './config'
import axios from 'axios'

export function getTopList () {
  const url = '/api/getRankInfo'

  const data = Object.assign({}, commonParams, {
    g_tk: 244721204,
    uin: 394287122,
    format: 'json',
    platform: 'h5',
    needNewCode: 1
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getTopListDetail (topid) {
  const url = '/api/getRankDetailInfo'

  const data = Object.assign({}, commonParams, {
    topid,
    g_tk: 244721204,
    uin: 394287122,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
