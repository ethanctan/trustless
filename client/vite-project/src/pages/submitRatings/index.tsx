import FormController from "./formController"

//@ts-ignore
export default function SubmitRating({account}){
    return (
        <div>
            This is the submit ratings page
            <FormController account = {account}/>
        </div>
    )
}