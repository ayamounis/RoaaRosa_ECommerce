export const dynamic = "force-dynamic";

import AddAddressForm from "./AddAddress.form";

export default function addressBook() {
    return (
        <div className="p-10  shadow-shadow">
            <h2 className="text-secondary2 font-medium text-xl">Add New Address</h2>
            <AddAddressForm />
        </div>
    )
}
