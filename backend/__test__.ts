import AlunoRepository from "./src/repositories/Aluno.repository"
import AlunoType from "./src/types/Aluno.type";

async function main() {
    const alunoRep = new AlunoRepository()
    const aluno: AlunoType = {
        matricula: "2026001",
        nome: "Felipe Silva",
        curso: "Engenharia de Software",
        email: "felipe.silva@email.com",
        telefone: "12999999999",
        cep: "12245000",
        endereco: "Rua das Flores, 123",
        cidade: "São José dos Campos",
        estado: "SP"
    };
    const res = await alunoRep.createAluno(aluno)
    console.log(res)
}

main()