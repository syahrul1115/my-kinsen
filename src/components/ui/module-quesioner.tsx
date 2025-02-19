"use client"

import * as React from "react";
import { Control, Controller, FieldArrayWithId, useForm } from "react-hook-form";

// types
import { ModuleQuesionerList, ModuleQuesioners } from "@/types/app";

// components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
    index: number;
    value: FieldArrayWithId<ModuleQuesionerList, "moduleQuesioners", "id">;
    control: Control<ModuleQuesionerList>;
}

export const ModuleQuesioner: React.FC<Props> = ({ index, value, control }) => {
    useForm<ModuleQuesioners>({
        defaultValues: value
    });
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={value.type}>
                <AccordionTrigger className="font-bold">
                    <h1>
                        {value.type.toUpperCase()} <span className="text-red-600">*</span>
                    </h1>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                    {value.quesioners.map((_, idx) => (
                        <div key={idx} className="border bg-[#FDFDFD] rounded-2xl px-8 py-3 flex flex-col md:flex-row gap-3 items-start">
                            <Controller
                                render={({ field }) => (
                                    <textarea id="quesioner" cols={36} rows={4} disabled {...field} className="bg-[#FDFDFD] resize-none">

                                    </textarea>
                                )}
                                name={`moduleQuesioners.${index}.quesioners.${idx}.question`}
                                control={control}
                            />
                            <Controller
                                render={({ field }) => (
                                    <div className="answer_quesioner w-48 py-3">
                                        <RadioGroup onValueChange={value => field.onChange(value)} defaultValue="0">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="5" id={`moduleQuesioners.${index}.quesioners.${idx}.value.sangat-setujuh`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.sangat-setujuh`}>Sangat Setujuh</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="4" id={`moduleQuesioners.${index}.quesioners.${idx}.value.setujuh`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.setujuh`}>Setujuh</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="3" id={`moduleQuesioners.${index}.quesioners.${idx}.value.netral`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.netral`}>Netral</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="2" id={`moduleQuesioners.${index}.quesioners.${idx}.value.tidak-setujuh`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.tidak-setujuh`}>Tidak Setujuh</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="1" id={`moduleQuesioners.${index}.quesioners.${idx}.value.sangat-tidak-setujuh`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.sangat-tidak-setujuh`}>Sangat Tidak Setujuh</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                )}
                                name={`moduleQuesioners.${index}.quesioners.${idx}.value`}
                                control={control}
                            />
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
