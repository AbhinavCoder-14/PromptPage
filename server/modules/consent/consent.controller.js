import prisma from "../../lib/primsaClient"
import { consentSchema } from "../../validation/consent"


export async function saveConsent(req,res) {

    const {userId, analytics, marketing, personalization,policyVersion,region} = req.body

    const existing = await prisma.consent_records.findUnique({
        where:{
            userId:userId
        },
    })

    try{
        const validator = consentSchema.parse({userId, analytics, marketing, personalization, policyVersion, region})
        
        await prisma.$transaction(async(tx)=>{
            await tx.consentEvent.create({
                        data: {
                        userId,
    
                        oldPreferences: existing ? {
                            analytics: existing.analytics,
                            marketing: existing.marketing,
                            personalization: existing.personalization
                        }:null,
    
                        newPreferences: {
                            analytics,
                            marketing,
                            personalization
                        },
    
                        policyVersion
                    }
                });
    
            await tx.consent_records.upsert({
                where:{
                    userId
                },
    
                create:{
                    userId,
                    analytics,
                    marketing,
                    personalization,
                    policyVersion,
                    region,
                },
                update: {
                    analytics,
                    marketing,
                    personalization,
                    policyVersion,
                    region,
                }
            })

            return res.status(200).json({
                success: true,
                });
    
        })

    }catch(error){
        console.log("validation error")

        return res.status(500).json({
            success: false,
            message: "Failed to save consent",
          });
    }   

    
        


    


    // if (existing == null){

    //     await prisma.$transaction(async(tx)=>{
    //         consentRecord

    
    //     }
            
    //     )}

    // else{

    //     // willl just find the userId and all the consent data 
    //     // and from that we create new consent_events and old and new data and after that we will also update the consent_records with new values
    //     await prisma.$transaction(async (tx) => {

    //         await tx.consentEvent.create({
    //             data: {
    //                 userId,

    //                 oldPreferences: {
    //                     analytics: existing.analytics,
    //                     marketing: existing.marketing,
    //                     personalization: existing.personalization
    //                 },

    //                 newPreferences: {
    //                     analytics,
    //                     marketing,
    //                     personalization
    //                 },

    //                 policyVersion
    //             }
    //         });

    //         await tx.consentRecord.update({
    //             where: {
    //                 userId
    //             },

    //             data: {
    //                 analytics,
    //                 marketing,
    //                 personalization,
    //                 policyVersion,
    //                 region
    //             }
    //         });
    // });



        
    }








}