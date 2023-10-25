
import { SupabaseClient } from "@supabase/supabase-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import { createContext, useContext } from "react";

export interface SupabaseProviderProps<
Database = any,
SchemaName extends string & keyof Database = "public" extends keyof Database
  ? "public"
  : string & keyof Database,
Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
  ? Database[SchemaName]
  : any
> {
  children: React.ReactNode,
  clientProvider: () => SupabaseClient<Database, SchemaName, Schema> | null
}

const ClientContext = createContext<Pick<SupabaseProviderProps, "clientProvider">>({
  clientProvider: () => { return null; }
});

export function SupabaseProvider(props: SupabaseProviderProps) {
  return <ClientContext.Provider value={{
    clientProvider: props.clientProvider
  }}>{props.children}</ClientContext.Provider>;
}

export type ClientType = SupabaseClient<any, "public", any>;

export function useClient(): ClientType {
  const context = useContext(ClientContext);
  return context.clientProvider()!;
}
