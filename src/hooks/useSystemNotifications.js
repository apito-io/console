import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { subscribeNotifySystem, SystemEventType, } from "../lib/systemSubscriptionClient";
import { pluginRegistryKeys, projectKeys, schemaKeys, } from "../lib/queryKeys";
const SystemNotificationsContext = createContext({
    connected: false,
});
function invalidateForEvent(queryClient, evt) {
    const type = evt.type ?? "";
    switch (type) {
        case SystemEventType.SchemaExecutionUpdated:
            void queryClient.invalidateQueries({ queryKey: schemaKeys.all });
            break;
        case SystemEventType.PluginStatusChanged:
            void queryClient.invalidateQueries({ queryKey: pluginRegistryKeys.all });
            break;
        case SystemEventType.ProjectCreated:
        case SystemEventType.ProjectUpdated:
            void queryClient.invalidateQueries({ queryKey: projectKeys.all });
            break;
        default:
            break;
    }
}
export const SystemNotificationsProvider = ({ children, }) => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();
    const [connected, setConnected] = useState(false);
    const handlerRef = useRef(() => { });
    handlerRef.current = (evt) => {
        invalidateForEvent(queryClient, evt);
    };
    const authed = isAuthenticated();
    useEffect(() => {
        if (!authed) {
            setConnected(false);
            return;
        }
        const dispose = subscribeNotifySystem((evt) => handlerRef.current(evt), setConnected);
        return () => {
            dispose();
            setConnected(false);
        };
    }, [authed, queryClient]);
    return (_jsx(SystemNotificationsContext.Provider, { value: { connected }, children: children }));
};
/** Returns whether the notifySystem websocket is connected. */
export function useSystemNotificationsState() {
    return useContext(SystemNotificationsContext);
}
