import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function BottomBar(){
    return (
        <Tabs>
            <Tabs.Screen 
                name="Home" 
                options={
                    {
                        tabBarIcon:({focused, size}) => (
                            <Ionicons name="home-sharp" size={24} color={focused ? "#08F" : "#000"} />
                        )
                    }
                }
            />
            <Tabs.Screen 
                name="Mascotas" 
                options={
                    {
                        tabBarIcon:({focused, size}) => (
                            <MaterialCommunityIcons name="dog" size={24} color={focused ? "#08F" : "#000"} />
                        )
                    }
                }
            />
            <Tabs.Screen 
                name="Mapa" 
                options={
                    {
                        tabBarIcon:({focused, size}) => (
                            <FontAwesome5 name="map-marked-alt" size={24} color={focused ? "#08F" : "#000"} />
                        )
                    }
                }
            />
            <Tabs.Screen 
                name="Perfil" 
                options={
                    {
                        tabBarIcon:({focused, size}) => (
                            <Ionicons name="person" size={24} color={focused ? "#08F" : "#000"} />
                        )
                    }
                }
            />
        </Tabs>
    );
}