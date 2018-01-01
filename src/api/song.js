// import jsonp from '@/common/js/jsonp'
import { commonParams } from './config'
import axios from 'axios'

export function getLyric (mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    loginUin: '394287122',
    hostUin: '0',
    needNewCode: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
