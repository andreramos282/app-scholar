type CursoType = {
    id?: number;
    nome: string;
    area: string;
    duracao: string | number;
    coordenador: string;
    periodo?: 'Diurno' | 'Noturno' | 'Matutino' | 'Vespertino';
};

export default CursoType;
