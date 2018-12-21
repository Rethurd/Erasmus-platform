const getToDoPostById = (toDoPosts, toDoPostId)=>{
    return toDoPosts.find((singlePost)=>singlePost.toDoPostId==toDoPostId)
}

export default getToDoPostById;