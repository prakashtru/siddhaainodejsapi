const express = require('express');
const axios = require('axios');
const router = express.Router();



// router.post('/patientCreate', async (req, res) => {
//     const data = req.body;
//     // const data = fn,ln,emr
//     try {
//         let result;
        
//         switch (data.emr) {
//             case 'drchrono':
//                 result = await drchronoPatientCreate(data);
//                 break;
//             case 'epic':
//                 result = await epicPatientCreate(data);
//                 break;
//             case 'cerner':
//                 result = await cernerPatientCreate(data);
//                 break;
//             case 'alveoHelth':
//                 result = await alveoHelthPatientCreate(data);
//                 break;
//             default:
//                 return res.status(400).json({ status: 400, data: 'Unsupported EMR type' });
//         }

//         return res.status(result.status).json({ status: result.status, data: result.data });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 500, data: 'Internal Server Error' });
//     }
// })
    


const emrFunctions = {
    drchrono: drchronoPatientCreate,
    epic: epicPatientCreate,
    cerner: cernerPatientCreate,
    alveoHelth: alveoHelthPatientCreate
};

router.post('/patientCreate', async (req, res) => {
    const data = req.body;

    const emrFunction = emrFunctions[data.emr];

    if (!emrFunction) {
        return res.status(400).json({ status: 400, data: 'Unsupported EMR type' });
    }

    try {
        const result = await emrFunction(data);
        return res.status(result.status).json({ status: result.status, data: result.data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, data: 'Internal Server Error' });
    }
});




router.post('/patientCreate', async (req, res) => {
    const data = req.body;

    try {
        let result;

        if (data.emr === 'drchrono') {
            result = await drchronoPatientCreate(data);
        } else if (data.emr === 'epic') {
            result = await epicPatientCreate(data);
        } else if (data.emr === 'cerner') {
            result = await cernerPatientCreate(data);
        } else if (data.emr === 'alveoHelth') {
            result = await alveoHelthPatientCreate(data);
        } else {
            return res.status(400).json({ status: 400, data: 'EMR not found' });
        }

        return res.status(result.status).json({ status: result.status, data: result.data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, data: 'Internal Server Error' });
    }
});




