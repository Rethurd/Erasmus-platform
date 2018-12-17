const getInfoPostById = (infoPosts, infoPostId)=>{
    return infoPosts.find((singlePost)=>singlePost.infoPostId==infoPostId)
}

export default getInfoPostById;