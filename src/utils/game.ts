export const parseUrl = (field:string) =>{
    
    console.log(field.trim())
    return field.trim().replace(/ /g,"%20");
}