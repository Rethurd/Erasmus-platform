const SelectToDoPosts = (toDoPosts,toDoFilters) => {
    if(toDoFilters.type!='ALL'){
        const typeFiltered =  toDoPosts.filter((singlePost)=>{
            return singlePost.type==toDoFilters.type;
        });
        if(toDoFilters.text==''){
            return typeFiltered;
        }else{
            return typeFiltered.filter((singlePost)=>{
                return singlePost.name.toLowerCase().includes(toDoFilters.text.toLowerCase()) || singlePost.description.toLowerCase().includes(toDoFilters.text.toLowerCase())
            });
        }
    }else{
        if(toDoFilters.text==''){
            return toDoPosts;
        }else{
            return toDoPosts.filter((singlePost)=>{
                return (singlePost.name.toLowerCase().includes(toDoFilters.text.toLowerCase()) || singlePost.description.toLowerCase().includes(toDoFilters.text.toLowerCase()));
            })
        }
    }
}
 
export default SelectToDoPosts;