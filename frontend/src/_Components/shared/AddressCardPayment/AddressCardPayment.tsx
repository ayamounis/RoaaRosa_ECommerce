'use client'
import { IAddress } from "@/app/_interfaces/address";
import { setAddress } from "@/redux/slices/Address";
import { useDispatch } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";

export default function AddressCardPayment({ address }: { address: IAddress }) {
    const dispatch = useDispatch()
    const { language } = useLanguage()
    const isAr = language === 'ar'

    const handleAddAddress = () => {
        dispatch(setAddress(address))
    }
    return (
        <div
            onClick={handleAddAddress}
            className="bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80] p-4 rounded-2xl shadow-sm hover:shadow-md duration-200 cursor-pointer"
        >
            <div className="space-y-1 text-xs">
                <p className="text-[#2B2320] dark:text-[#FAF6F0] font-semibold">
                    {isAr ? 'مكان العنوان:' : 'Address:'}{' '}
                    <span className="text-[#C48D80] font-bold">{address.name}</span>
                </p>
                <p className="text-[#988172]">
                    {isAr ? 'الهاتف:' : 'Phone:'}{' '}
                    <span className="text-[#2B2320] dark:text-[#FAF6F0]">{address.phone}</span>
                </p>
                <p className="text-[#988172]">
                    {isAr ? 'التفاصيل:' : 'Details:'}{' '}
                    <span className="text-[#2B2320] dark:text-[#FAF6F0]">{address.details}</span>
                </p>
            </div>
        </div>
    )
}
