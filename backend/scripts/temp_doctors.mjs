
// Temporary file to extract doctors
import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import homepage_img from './homepage_img.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import upload_area from './upload_area.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import bddoc1 from './bddoc (1).png'
import bddoc2 from './bddoc (2).png'
import bddoc3 from './bddoc (3).png'
import bddoc4 from './bddoc (4).png'
import bddoc5 from './bddoc (5).png'
import bddoc6 from './bddoc (6).png'
import bddoc7 from './bddoc (7).png'
import bddoc8 from './bddoc (8).png'
import bddoc9 from './bddoc (9).png'
import bddoc10 from './bddoc (10).png'
import bddoc11 from './bddoc (11).png'
import bddoc12 from './bddoc (12).png'
import bddoc13 from './bddoc (13).png'
import bddoc14 from './bddoc (14).png'
import bddoc15 from './bddoc (15).png'
import bddoc16 from './bddoc16.jpeg'
import bddoc17 from './bddoc17.jpeg'
import bddoc18 from './bddoc18.jpeg'
import bddoc19 from './bddoc19.jpeg'
import bddoc20 from './bddoc20.jpeg'
import bddoc21 from './bddoc21.jpeg'
import bddoc22 from './bddoc22.jpeg'
import bddoc23 from './bddoc23.jpeg'
import bddoc24 from './bddoc24.jpeg'
import bddoc25 from './bddoc25.jpeg'
import bddoc26 from './bddoc26.jpeg'
import bddoc27 from './bddoc27.jpeg'
import bddoc28 from './bddoc28.jpeg'
import bddoc29 from './bddoc29.jpeg'


import doc1 from './bddoc (1).png'
import doc2 from './bddoc (2).png'
import doc3 from './bddoc (3).png'
import doc4 from './bddoc (4).png'
import doc5 from './bddoc (5).png'
import doc6 from './bddoc (6).png'
import doc7 from './bddoc (7).png'
import doc8 from './bddoc (8).png'
import doc9 from './bddoc (9).png'
import doc10 from './bddoc (10).png'
import doc11 from './bddoc (11).png'
import doc12 from './bddoc (12).png'
import doc13 from './bddoc (13).png'
import doc14 from './bddoc (14).png'
import doc15 from './bddoc (15).png'
import bddoc31 from './bddoc31.jpeg'
import bddoc32 from './bddoc32.jpeg'
import bddoc33 from './bddoc33.jpeg'
import bddoc34 from  './bddoc34.jpeg'
import Dermatologist from './Dermatologist.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    homepage_img,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    upload_area,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'neurologist',
        image: Neurologist
    },
    {
        speciality: 'gastroenterologist',
        image: Neurologist
    },
    {
        speciality: 'physician',
        image: Neurologist
    }
]


export const doctors = [
    {
        _id: 'bddoc1',
        name: 'Mr.Alim Uddin',
        image: bddoc1,
        speciality: 'neurologist',
        degree: 'MBBS, MD (Neurology), CCD (BIRDEM)',
        experience: 'Fellowship Training in ACS & EMG and Neuromuscular Disease Neurology',
        about: '',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1809, 23.4607] // [lng, lat] - Cumilla center
        }
    },
    {
        _id: 'bddoc2',
        name: 'Prof. Dr. Md. Nazmul Hasan Chowdhury',
        image: bddoc2,
        speciality: 'neurologist',
        degree: 'MBBS, MCPS (Medicine), MD (Neurology',
        experience: 'Neurology (Brain, Stroke, Nerve & Medicine) Specialist',
        about: 'Neurology specialist.',
        fees: 600,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1850, 23.4650] // [lng, lat] - North Cumilla
        }
    },
    {
        _id: 'bddoc3',
        name: 'Dr. Soumitra Das',
        image: bddoc3,
        speciality: 'neurologist',
        degree: 'Dr. Soumitra Das MBBS, MD (Neurology)',
        experience: 'Brain, Stroke, Nerve & Neurology Specialist Consultant, Neurology Cumilla Medical College & Hospital',
        about: ' Neurology Cumilla Medical College & Hospital.',
        fees: 300,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1750, 23.4550] // [lng, lat] - Cumilla Medical College area
        }
    },
    {
        _id: 'bddoc4',
        name: 'Dr. Shahida Akter Rakhi',
        image: bddoc4,
        speciality: 'gynecologist',
        degree: 'MBBS, BCS (Health), FCPS (OBGYN) Gynecology, Obstetrics, Infertility',
        experience: '2 Years',
        about: 'Specialist & Surgeon Consultant, Gynecology & Obstetrics Cumilla Medical College & Hospita',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1900, 23.4700] // [lng, lat] - East Cumilla
        }
    },
    {
        _id: 'bddoc5',
        name: 'Dr. Parvin Mujib',
        image: bddoc5,
        speciality: 'gynecologist',
        degree: 'MBBS, BCS (Health), DGO (OBGYN), MCPS (OBGYN)',
        experience: 'Gynecology, Obstetrics Specialist & Surgeon',
        about: 'Senior Consultant, Gynecology & Obstetrics Cumilla Medical College & Hospita',
        fees: 50,
        address: {
            line1: 'Cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1755, 23.4555] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc6',
        name: 'Dr. Nasrin Akter Popy',
        image: bddoc6,
        speciality: 'gynecologist',
        degree: 'MBBS, BCS (Health), FCPS (OBGYN)',
        experience: '4 Years',
        about: 'Trained in Transvaginal Ultrasound, Hysteroscopy & Colposcopy Gynecology, Obstetrics Specialist & Surgeon Consultant, Gynecology & Obstetrics Cumilla Medical College & Hospital.',
        fees: 500,
        address: {
            line1: 'Cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1760, 23.4560] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc7',
        name: 'Dr. Dilruba Aktar',
        image: bddoc7,
        speciality: 'dermatologist',
        degree: 'MBBS, MCPS, FCPS (SKIN & VD)',
        experience: 'Skin, Allergy, Sexual Health Specialist & Cosmetic Dermato-Surgeon',
        about: 'Associate Professor & Head, Dermatology & Venereology Mainamoti Medical College & Hospital',
        fees: 500,
        address: {
            line1: 'Mainamoti Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1700, 23.4500] // [lng, lat] - Mainamoti area
        }
    },
    {
        _id: 'bddoc8',
        name: 'Dr. Gazi Md. Matiur Rahman',
        image: bddoc8,
        speciality: 'physician',
        degree: 'MBBS, BCS (Health), MD (SKIN & VD)',
        experience: '3 Years',
        about: 'Skin, Allergy, Leprosy & Sex Diseases Specialist Assistant Professor, Dermatology & Venereology',
        fees: 600,
        address: {
            line1:'Cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1758, 23.4558] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc9',
        name: 'Dr. Md. Nazrul Islam Shaheen',
        image: bddoc9,
        speciality: 'dermatologist',
        degree: 'MBBS, DDV (BSMMU), DSF (NUH, Singapore)',
        experience: 'Skin, Allergy, Leprosy, Sex Diseases Specialist & Dermato Surgeon',
        about: 'Assistant Professor, Dermatology & Venereology',
        fees: 300,
        address: {
            line1: 'Mainamoti Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1705, 23.4505] // [lng, lat] - Mainamoti area
        }
    },
    {
        _id: 'bddoc10',
        name: 'Dr. Md. Nazmus Sihan',
        image: bddoc10,
        speciality: 'pediatricians',
        degree:'MBBS, BCS (Health), MD (Pediatrics)',
        experience: 'Resident Physician, Pediatrics',
        about: 'Neonatal ICU, Newborn & Child Diseases Specialist',
        fees: 400,
        address: {
            line1: 'Cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1765, 23.4565] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc11',
        name: 'Dr. Md. Iftekhar-Ul-Haque Khan',
        image: bddoc11,
        speciality: 'pediatricians',
        degree: 'MBBS, FCPS (Pediatrics)',
        experience: 'Newborn, Adolescent & Child Diseases Specialist',
        about: 'Assistant Professor, Pediatrics.',
        fees: 500,
        address: {
            line1: 'cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1770, 23.4570] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc12',
        name: 'Dr. Habibur Rahman Bhuiyan',
        image: bddoc12,
        speciality: 'pediatricians',
        degree: 'MBBS (DMC), BCS (Health), MD (Neonatology - BSMMU)',
        experience: 'Newborn & Child Diseases Specialist',
        about: 'Assistant Registrar, Department of Pediatrics',
        fees: 50,
        address: {
            line1: 'cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1775, 23.4575] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc13',
        name: 'Dr. A.K.M. Shafiqul Islam Qayum',
        image: bddoc13,
        speciality: 'gastroenterologist',
        degree: 'MBBS, BCS (Health), MCPS (Medicine), FCPS (Medicine), MD (Gastroenterology), MACP (USA)',
        experience: 'Gastroenterology, Medicine & Liver Diseases Specialist Assistant Professor, Gastroenterology',
        about: 'Assistant Registrar, Department of gastroenterology',
        fees: 500,
        address: {
            line1: 'cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1780, 23.4580] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc14',
        name: 'Dr. Mohammad Shah Jamal',
        image: bddoc14,
        speciality: 'gastroenterologist',
        degree: 'MBBS, FCPS (Medicine), MD (Gastroenterology), Training (Diabetes-BIRDEM)',
        experience: 'Gastroenterology, Liver, Medicine & Diabetes Specialist',
        about: 'Dr. mohammad shah jamal has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 600,
        address: {
            line1: 'cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1785, 23.4585] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc16',
        name: 'Dr. Shahjahan Alam',
        image: bddoc16,
        speciality: 'pediatricians',
        degree: 'MBBS, BCS (Health), MD (Pediatrics)',
        experience: '3 Years',
        about: 'Pediatrics specialist with expertise in newborn and child diseases.',
        fees: 400,
        address: {
            line1: 'Cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1790, 23.4590] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc17',
        name: 'Dr. Rony Howladar',
        image: bddoc17,
        speciality: 'dermatologist',
        degree: 'MBBS, DDV (BSMMU), DSF (NUH, Singapore)',
        experience: '5 Years',
        about: 'Skin, Allergy, Leprosy, Sex Diseases Specialist & Dermato Surgeon',
        fees: 350,
        address: {
            line1: 'Mainamoti Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1710, 23.4510] // [lng, lat] - Mainamoti area
        }
    },
    {
        _id: 'bddoc18',
        name: 'Dr. Ali Akbar',
        image: bddoc18,
        speciality: 'neurologist',
        degree: 'MBBS, MCPS (Medicine), MD (Neurology)',
        experience: '7 Years',
        about: 'Neurology (Brain, Stroke, Nerve & Medicine) Specialist',
        fees: 500,
        address: {
            line1: 'Cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1795, 23.4595] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc19',
        name: 'Dr. Shapan Dey',
        image: bddoc19,
        speciality: 'gastroenterologist',
        degree: 'MBBS, FCPS (Medicine), MD (Gastroenterology)',
        experience: '6 Years',
        about: 'Gastroenterology, Medicine & Liver Diseases Specialist',
        fees: 450,
        address: {
            line1: 'Cumilla Medical College & Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1800, 23.4600] // [lng, lat] - Cumilla Medical College
        }
    },
    {
        _id: 'bddoc20',
        name: 'Dr. Anika Rahman',
        image: bddoc20,
        speciality: 'cardiologist',
        degree: 'MBBS, FCPS (Medicine), MD (Cardiology)',
        experience: '8 Years',
        about: 'Cardiology specialist with expertise in heart diseases and cardiovascular care.',
        fees: 600,
        address: {
            line1: 'Cumilla Cardiac Center, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1805, 23.4605] // [lng, lat] - Cumilla City Center
        }
    },
    {
        _id: 'bddoc21',
        name: 'Dr. Farhana Ahmed',
        image: bddoc21,
        speciality: 'neurologist',
        degree: 'MBBS, FCPS (Ophthalmology)',
        experience: '6 Years',
        about: 'Eye care specialist with expertise in vision correction and eye surgeries.',
        fees: 400,
        address: {
            line1: 'Cumilla Eye Care Center, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1810, 23.4610] // [lng, lat] - Cumilla Eye Center
        }
    },
    {
        _id: 'bddoc22',
        name: 'Dr. Kamrul Hassan',
        image: bddoc22,
        speciality: 'neurologist',
        degree: 'MBBS, FCPS (Orthopedics)',
        experience: '9 Years',
        about: 'Bone and joint specialist with expertise in musculoskeletal disorders.',
        fees: 550,
        address: {
            line1: 'Cumilla Orthopedic Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1815, 23.4615] // [lng, lat] - Cumilla Orthopedic Hospital
        }
    },
    {
        _id: 'bddoc23',
        name: 'Dr. Nusrat Jahan',
        image: bddoc23,
        speciality: 'neurologist',
        degree: 'MBBS, MD (Psychiatry)',
        experience: '7 Years',
        about: 'Mental health specialist with expertise in psychological disorders and therapy.',
        fees: 450,
        address: {
            line1: 'Cumilla Mental Health Clinic, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1820, 23.4620] // [lng, lat] - Cumilla Mental Health Center
        }
    },
    {
        _id: 'bddoc24',
        name: 'Dr. Tariqul Islam',
        image: bddoc24,
        speciality: 'gastroenterologist',
        degree: 'MBBS, FCPS (Medicine), MD (Pulmonology)',
        experience: '8 Years',
        about: 'Respiratory specialist with expertise in lung diseases and breathing disorders.',
        fees: 500,
        address: {
            line1: 'Cumilla Chest Hospital, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1825, 23.4625] // [lng, lat] - Cumilla Chest Hospital
        }
    },
    {
        _id: 'bddoc25',
        name: 'Dr. Sumaiya Khatun',
        image: bddoc25,
        speciality: 'gastroenterologist',
        degree: 'MBBS, MD (Endocrinology)',
        experience: '7 Years',
        about: 'Hormone disorder specialist with expertise in diabetes and thyroid diseases.',
        fees: 450,
        address: {
            line1: 'Cumilla Diabetes Center, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1830, 23.4630] // [lng, lat] - Cumilla Diabetes Center
        }
    },
    {
        _id: 'bddoc26',
        name: 'Dr. Abu Bakar Siddique',
        image: bddoc26,
        speciality: 'gastroenterologist',
        degree: 'MBBS, FCPS (Surgery), MS (Urology)',
        experience: '10 Years',
        about: 'Urinary tract and male reproductive system specialist.',
        fees: 550,
        address: {
            line1: 'Cumilla Urology Clinic, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1835, 23.4635] // [lng, lat] - Cumilla Urology Clinic
        }
    },

    {
        _id: 'bddoc27',
        name: 'Dr. Rashidul Alam',
        image: bddoc27,
        speciality: 'general physician',
        degree: 'MBBS, FCPS (Medicine), MD (Hematology)',
        experience: '8 Years',
        about: 'Blood disorder specialist with expertise in anemia and blood cancers.',
        fees: 500,
        address: {
            line1: 'Cumilla Blood Care Center, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1840, 23.4640] // [lng, lat] - Cumilla Blood Care Center
        }
    },
    {
        _id: 'bddoc28',
        name: 'Dr. Farzana Afroza',
        image: bddoc28,
        speciality: 'gynecologist',
        degree: 'MBBS, FCPS (Radiology)',
        experience: '7 Years',
        about: 'Medical imaging specialist with expertise in diagnostic radiology.',
        fees: 400,
        address: {
            line1: 'Cumilla Imaging Center, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1845, 23.4645] // [lng, lat] - Cumilla Imaging Center
        }
    },
    {
        _id: 'bddoc29',
        name: 'Dr. Mahmudul Hasan',
        image: bddoc29,
        speciality: 'gynecologist',
        degree: 'MBBS, FCPS (Medicine), MD (Nephrology)',
        experience: '9 Years',
        about: 'Kidney specialist with expertise in renal diseases and dialysis.',
        fees: 550,
        address: {
            line1: 'Cumilla Kidney Care Center, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1850, 23.4650] // [lng, lat] - Cumilla Kidney Care Center
        }
    },
   
    {
        _id: 'bddoc31',
        name: 'Dr. Tanzina Rahman',
        image: bddoc31,
        speciality: 'gynecologist',
        degree: 'MBBS, MD (Allergy & Immunology)',
        experience: '6 Years',
        about: 'Allergy specialist with expertise in immune system disorders.',
        fees: 400,
        address: {
            line1: 'Cumilla Allergy Clinic, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1860, 23.4660] // [lng, lat] - Cumilla Allergy Clinic
        }
    },
    {
        _id: 'bddoc32',
        name: 'Dr. Saifur Rahman',
        image: bddoc32,
        speciality: 'pediatricians',
        degree: 'MBBS, FCPS (Medicine), MD (Critical Care)',
        experience: '8 Years',
        about: 'Critical care specialist with expertise in intensive care medicine.',
        fees: 550,
        address: {
            line1: 'Cumilla ICU Center, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1865, 23.4665] // [lng, lat] - Cumilla ICU Center
        }
    },
    {
        _id: 'bddoc33',
        name: 'Dr. Mili Akter',
        image: bddoc33,
        speciality: 'cardiologist',
        degree: 'MBBS, FCPS (Medicine), MD (Rheumatology)',
        experience: '7 Years',
        about: 'Joint and autoimmune disease specialist.',
        fees: 480,
        address: {
            line1: 'Cumilla Joint Care Center, Cumilla',
            line2: 'Circle, Ring Road, London'
        },
        location: {
            coordinates: [91.1870, 23.4670] // [lng, lat] - Cumilla Joint Care Center
        }
    },
     {
        _id: 'bddoc34',
        name: 'Dr. Kamrun Naher',
        image: bddoc34,
        speciality: 'gynecologist',
        degree: 'MBBS, FCPS (Gynecology & Obstetrics)',
        experience: '12 Years',
        about: 'Gynecologist providing obstetric and women’s health care in Sherpur.',
        fees: 500,
        address: {
            line1: 'Sherpur Town, Mymensingh',
            line2: 'Clinic near Sherpur Bus Stand'
        },
        location: {
            coordinates: [90.0079, 25.0188] // [lng, lat] - Sherpur, Mymensingh
        }
    },
    
];
