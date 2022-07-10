import { Axiom } from './Model'

export class MissingFieldError extends Error {

}

export function validateAsAxiomEntry(arg: any){
    if (!(arg as Axiom).name){
        throw new MissingFieldError('Value for name required!')
    }
    if (!(arg as Axiom).location){
        throw new MissingFieldError('Value for location required!')
    }
    if (!(arg as Axiom).id){
        throw new MissingFieldError('Value for id required!')
    }
}