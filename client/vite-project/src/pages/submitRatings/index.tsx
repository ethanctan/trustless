import FormController from "./formController"

//@ts-ignore
export default function SubmitRating({account}){
    return (
        <div className="flex flex-col flex-grow justify-center">
            <h3 className="unbounded text-3xl my-5">
                Submit a new rating
            </h3>
            <div className="poppins text-lg pb-1 rounded-b-lg duration-300 px-10">
            You can rate up to 3000 DeFI protocols. For each rating, you'll score a protocol according to 5 criteria for trust. The more ratings you submit, and the closer each rating is to the eventual average score, the more $TRUST you'll earn.
            </div>
            <FormController account = {account}/>
        </div>
    )
}