// app/types.ts
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
     multipleUrls?: {
          url: string; name?: string
     }[];
     useMultipleUrls?: boolean;
     createdAt?: string;
     updatedAt?: string;
     clicks?: number;
     showToPortal?: boolean;
     isPinned?: boolean;
     nameUrl?: string;
     category?: string;
     description?: string;
     price?: number;

     // Statistik
     deviceStats?: {
          desktop?: number;
          mobile?: number;
          tablet?: number;
     };
     browserStats?: {
          [key: string]: number;
     }
     geoStats?: {
          [key: string]: number;
     };
     refererStats?: {
          [key: string]: number;
     };

     showConfirmationPage?: boolean;
     confirmationPageSettings?: {
          customMessage?: string;
     };
}

export interface Profile {
     id: string;
     name: string;
     username: string;
     updatedAt?: string;
     profilePicture?: string;
     socialMedia?: {
          instagram?: string;
          linkedin?: string;
          spotify?: string;
          github?: string;
          mail?: string;
          tiktok?: string;
     }
     bio?: string;
     website?: string;
     sortSettings?: { field: string; direction: "asc" | "desc" };
     categorySortSettings?: {
          [categoryId: string]: {
               type?: "field" | "manual";
               field?: string; 
               direction?: "asc" | "desc"; 
               order?: string[]; 
          };
     };
}

export interface TableRenderData {
     id: string;
     [key: string]: string | number | boolean | React.ReactNode;
}

export interface AnalyticsSummary {
     totalClicks: number;
     averageClicks: number;
     topLinks: { name: string; clicks: number }[];
     deviceDistribution: { name: string; value: number }[];
     referrerDistribution: { name: string; value: number }[];
     geoDistribution: { name: string; value: number }[];
     browserDistribution: { name: string, value: number }[];
}

export interface Subdomain {
     id: string;
     name: string;
     type: string;
     content: string;
}

export interface DnsRecord {
     name: string;
     type: "A" | "CNAME";
     content: string;
}

export interface CloudflareResponse {
     success: boolean;
     result: {
          name: string;
          type: string;
          content: string;
     }[];
}

export interface ApiEndpoint {
     id: string;
     name: string;
     slug: string;
     method: string;
     fields: {
          fieldName: string;
          type: "text" | "number" | "boolean" | "date";
          required: boolean;
          defaultValue: string | number | boolean | null;
     }[];
}

// Union type utama yang sudah ada
export type TableData = Experience | Project | Link | Profile | Subdomain | ApiEndpoint;