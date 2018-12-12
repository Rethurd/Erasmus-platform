const getHelpPostById = (helpPosts, helpPostId)=>{
    return helpPosts.find((singlePost)=>singlePost.postId==helpPostId)
}

export default getHelpPostById;