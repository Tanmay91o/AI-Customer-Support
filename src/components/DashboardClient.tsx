'use client'
import axios from "axios"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from 'react'

function DashboardClient({ ownerId }: { ownerId: string }) {
    const navigate = useRouter()

    const [businessName, setBusinessName] = useState("")
    const [supportEmail, setSupportEmail] = useState("")
    const [knowledge, setknowledge] = useState("")
    const [loding, setLoding] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSettings = async () => {
        setLoding(true)
        setSaved(true)
        try {
            const result = await axios.post("/api/settings",
                { ownerId, businessName, supportEmail, knowledge })
            console.log(result.data);
            setLoding(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (error) {
            console.log(error);
            setLoding(false)
        }
    }

    useEffect(() => {
        if (ownerId) {
            const handleGetDetails = async () => {
                try {
                    const result = await axios.post("/api/settings/get",
                        { ownerId })
                    setBusinessName(result.data.businessName)
                    setSupportEmail(result.data.supportEmail)
                    setknowledge(result.data.knowledge)
                } catch (error) {
                    console.log(error);
                }
            }
            handleGetDetails()
        }
    }, [ownerId])

    return (
        <div className='min-h-screen bg-zinc-50 text-zinc-900'>

            <motion.div
                initial={{ y: -40 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl 
            border-b border-zinc-200'>
                <div className='max-w-7xl mx-auto px-16 h-16 flex items-center justify-between'>
                    <div className='text-lg font-semibold tracking-tight' onClick={() => navigate.push("/")}>
                        Support <span className='text-zinc-400'>AI</span>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-zinc-300 text-sm
                     hover:bg-zinc-100 transition"
                        onClick={() => navigate.push("/embed")}>
                        Embed ChatBot</button>
                </div>
            </motion.div >

            <div className="flex justify-center px-4 py-14 mt-20">
                <motion.div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10">
                    <div className="mb-10">
                        <h1 className="text-2xl font-semibold">ChatBot Settings</h1>
                        <p className="text-zinc-500 mt-1">
                            Menage your AI ChatBot knowledge and Business Details</p>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-lg font-medium mb-4">Business Details</h1>
                        <div className="space-y-4">
                            <input type="text" className="w-full rounded-xl border border-zinc-300
                            px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                                placeholder="Business Name"
                                onChange={(e) => setBusinessName(e.target.value)} value={businessName} />
                            <input type="text" className="w-full rounded-xl border border-zinc-300
                            px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                                placeholder="Support Email"
                                onChange={(e) => setSupportEmail(e.target.value)} value={supportEmail} />
                        </div>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-lg font-medium mb-4">Knowledge Base</h1>
                        <p className="text-sm text-zinc-500 mb-4">
                            Add FAQs,Policies,Delivary info,Refunds etc.</p>
                        <div className="space-y-4">
                            <textarea className="w-full h-54 rounded-xl border border-zinc-300
                            px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                                placeholder={`Example:
                Refund Policy : 7 days return available.
                Delivary Time : 3-5 working days.
                Cash on delivery available.
                Support hours.
                        `} onChange={(e) => setknowledge(e.target.value)} value={knowledge} />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={loding}
                            onClick={handleSettings}
                            className="px-7 py-3 rounded-xl bg-black text-white text-sm font-medium
                            hover:bg-zinc-800 transition disabled:opacity-60"
                        >
                            {loding ? "Saving..." : "Save"}
                        </motion.button>

                        {saved && <motion.span
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm font-medium text-emerald-600"
                        >
                            ✓ Settings Saved
                        </motion.span>}

                    </div>

                </motion.div>
            </div>

        </div >
    )
}

export default DashboardClient