import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";


export default function FeedbackScreen() {
    const {submissionId} = useLocalSearchParams();

    const [ FeedbackText, setFeedbackText] = useState("");
    const [ score , setScore] = useState("");


    const



}