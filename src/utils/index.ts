/**
 * Valida se o CPF é válido.
 * @param cpf - CPF em formato de string.
 * @returns Retorna true se o CPF for válido, false caso contrário.
 */
export function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }
    let primeiroDigitoVerificador = 11 - (soma % 11);
    if (primeiroDigitoVerificador >= 10) primeiroDigitoVerificador = 0;

    if (primeiroDigitoVerificador !== Number(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }
    let segundoDigitoVerificador = 11 - (soma % 11);
    if (segundoDigitoVerificador >= 10) segundoDigitoVerificador = 0;

    if (segundoDigitoVerificador !== Number(cpf[10])) return false;

    return true;
}
