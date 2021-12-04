const fs = require('fs');



const brisiDokument = (doklink) => {
    if (fs.existsSync(doklink)) {
        fs.unlink(doklink, (err) => {
        if (err) {
            throw (err);
        }
    });
    }


    
}

exports.brisiDokument = brisiDokument;