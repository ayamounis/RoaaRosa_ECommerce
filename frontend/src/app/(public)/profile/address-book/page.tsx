export const dynamic = "force-dynamic";

import AddAddressForm from "./AddAddress.form";

export default function AddressBook() {
    return (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm">
            <AddAddressForm />
        </div>
    );
}
