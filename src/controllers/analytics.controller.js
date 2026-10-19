const { restore } = require("pdfkit")
const analytics = require("../services/analytics.service")


exports.getEcoPerformance = async(req, res,next)=>{
    try {
        const result = await analytics.getEcoPerformance()

        return res.status(200).json({
            success : true,
            message : "Score d’Éco-Conduite & Performance Chauffeur calculer avec success",
            data : result
        })
    } catch (error) {
        next(error)
    }
}