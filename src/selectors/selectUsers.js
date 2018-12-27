const SelectUsers = (users,usersFilters) => {
    
        if(usersFilters.text==''){
            return users;
        }else{
            return users.filter((singleUser)=>{
                return (singleUser.userName.toLowerCase().includes(usersFilters.text.toLowerCase()));
            })
        }
    
}
 
export default SelectUsers;