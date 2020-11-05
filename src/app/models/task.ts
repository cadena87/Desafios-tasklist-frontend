export enum TaskStatus {
  NOVO = 'NOVO',
  FINALIZADO = 'FINALIZADO'
}

export class Task {
  id: number;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  dataCriacao: Date;
  dataEdicao: Date;
  dataConclusao: Date;
  color = '#000';
  isChecked: boolean;

  constructor() {

  }
}
