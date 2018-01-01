import { commonParams } from './config'
import axios from 'axios'

export function getHotkey () {
  const url = '/api/gethotkey'

  const data = Object.assign({}, commonParams, {
    g_tk: '244721204',
    uin: '394287122',
    format: 'json',
    platform: 'h5',
    needNewCode: 1
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

export function getSearch (query, page, zhida, perpage) {
  const url = '/api/getSearch'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    g_tk: '244721204',
    uin: '394287122',
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
