/*
 * 文章相关请求模块
 */
import request from '@/utils/request.js'

/*
*获取文章列表
*/
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // GET方法一般是Query参数，POST方法一般是body参数
    // Body参数使用data设置
    // Query参数使用params设置
    // Headers参数使用headers设置

    // 接口文件中query参数所以这里使用params设置
    // 不传参表示查询所有文章列表
    params
  })
}

/*
获取文章频道
*/
export const getArticlechannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

/*
删除文章
*/
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 接口文档中写的路径参数需要在url中传递
    // 凡是看见接口路径中有：xxx格式的字段，则需要传递路径参数
    // /mp/v1_0/articles/:target
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/*
添加文章
*/
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft // 是否存为草稿（true 为草稿）
    },
    data
  })
}

/*
编辑文章
*/
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft // 是否存为草稿（true 为草稿）
    },
    data
  })
}

/*
获取文章
*/
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
    // params: {
    //   draft // 是否存为草稿（true 为草稿）
    // },
    // data
  })
}

/**
 * 修改文章评论状态
 */

export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      // 代码的属性名不受代码规范限制，但是参数要受限制，且属性名这里是接口文档规定的名字，不能修改
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
