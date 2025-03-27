// types.ts
export interface Experience {
     id: string;
     company: string;
     role: string;
     year: string;
     logo: string;
     link: string;
     techStack: string[];
}

export interface Project {
     id: string;
     title: string;
     image: string;
     description: string;
     link: string;
     technology: string[];
}

export interface Link {
     id: string;
     originalUrl: string;
     shortUrl?: string;
     createdAt?: string;
     clicks?: number;

     // Statistik
     deviceStats?: {
          desktop?: number;
          mobile?: number;
          tablet?: number;
     };
     geoStats?: {
          [key: string]: number;
     };
     refererStats?: {
          [key: string]: number;
     };

     showConfirmationPage: boolean;
     confirmationPageSettings?: {
          customMessage?: string;
     };
}

export type TableData = Experience | Project | Link;