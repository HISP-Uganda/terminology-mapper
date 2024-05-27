import axios from "axios";
import { useQuery } from "react-query";

export const api = axios.create({
    baseURL: "https://services.fhir.hispuganda.org/fhir/",
});

export async function searchConcepts(index: string, q: string) {
    const { data } = await api.get("concepts", {
        params: { q, index },
    });
    return data;
}

export async function searchConcept(index: string, id: string) {
    const { data } = await api.get(`concepts/${id}`, {
        params: { index },
    });
    return data;
}

export function useSearch(index: string, q: string) {
    return useQuery<any, Error>(["search", index, q], async () => {
        return await searchConcepts(index, q);
    });
}

export function useConcept(index: string, id: string) {
    return useQuery<any, Error>(["concept", index, id], async () => {
        return await searchConcept(index, id);
    });
}

export async function indexConcept(concept: any) {
    const { index, ...rest } = concept;
    return await api.post("index", rest, { params: { index } });
}

export async function deleteDoc(concept: any) {
    const { index, id } = concept;
    return await api.get("delete", { params: { index, id } });
}
