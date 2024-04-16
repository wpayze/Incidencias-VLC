import { Category } from "@/constants/category";
import { Issue } from "@/constants/issue";
import { NewIssue } from "@/constants/request/newIssue";
import { Status } from "@/constants/status";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const issueService = {
  getIssues: async (): Promise<Issue[]> => {
    try {
      const response = await fetch(`${API_URL}/issues`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las incidencias");
      }

      const issues: Issue[] = await response.json();
      return issues;
    } catch (error) {
      console.error("Hubo un problema al obtener las incidencias:", error);
      throw error;
    }
  },
  getIssue: async (id: string): Promise<Issue> => {
    try {
      const response = await fetch(`${API_URL}/issues/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener la incidencia con ID ${id}`);
      }

      const issue: Issue = await response.json();
      return issue;
    } catch (error) {
      console.error(
        `Hubo un problema al obtener la incidencia con ID ${id}:`,
        error
      );
      throw error;
    }
  },
  createIssue: async (newIssue: NewIssue): Promise<Issue> => {
    try {
      const response = await fetch(`${API_URL}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIssue),
      });

      if (!response.ok) {
        throw new Error(`Error al crear la incidencia`);
      }

      const createdIssue: Issue = await response.json();
      return createdIssue;
    } catch (error) {
      console.error(`Hubo un problema al crear la incidencia:`, error);
      throw error;
    }
  },
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las categorias");
      }

      const categories: Category[] = await response.json();
      return categories;
    } catch (error) {
      console.error("Hubo un problema al obtener las categorias:", error);
      throw error;
    }
  },
  getStatuses: async (): Promise<Status[]> => {
    try {
      const response = await fetch(`${API_URL}/statuses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los estados");
      }

      const statuses: Status[] = await response.json();
      return statuses;
    } catch (error) {
      console.error("Hubo un problema al obtener los estados:", error);
      throw error;
    }
  },
};

export default issueService;
