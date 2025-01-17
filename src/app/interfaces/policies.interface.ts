export interface Policies {
  imagePolicies?: string;
  informationalMessage?: string;
  imageConfa?: string;
  tratamientoDeDatos?: TratamientoDeDatos;
  condicionesDeUsoDelServicio?: CondicionesDeUsoDelServicio;
}

export interface TratamientoDeDatos {
  title?: string;
  subtitle?: string;
  titleBody?: string;
  paragraphs?: Paragraph[];
}

export interface CondicionesDeUsoDelServicio {
  title?: string;
  subtitle?: string;
  paragraphs?: Paragraph[];
}

export interface Paragraph {
  paragraph?: string;
}
