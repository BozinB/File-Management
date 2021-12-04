const listajRekurzivno = async (niza) => {
    let isprati = []
  if (niza.length === 0) return []
  for (i in niza) {
      const Rekurzija = async (i) => {
          let prikaci = {}
              const Deps = await Department.findOne({_id: i})
              prikaci['imeKirilica'] = Deps.imeKirilica
              prikaci['_id'] = Deps._id
              prikaci['files'] = Deps.files
              if (Deps.children.length > 0) {
                  prikaci['children'] = await listajRekurzivno(Deps.children)
  
              } else {
                  prikaci['children'] = []
              }
                  isprati.push(prikaci)
          }
          await Rekurzija(niza[i])
  }
  return isprati
}

exports.listajRekurzivno = listajRekurzivno;