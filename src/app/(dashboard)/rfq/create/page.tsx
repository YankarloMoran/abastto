'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createRfq } from '@/actions/rfq'
import { autoStructureRfq } from '@/actions/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Plus, Trash2, ArrowRight, ArrowLeft, FileText, ShoppingCart, Settings2, CheckCircle2, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { PaymentTerms, RfqCategory } from '@prisma/client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const RfqItemSchema = z.object({
    name: z.string().min(2, { message: 'El nombre del producto es obligatorio.' }),
    quantity: z.coerce.number().positive({ message: 'La cantidad debe ser mayor a 0.' }),
    unit: z.string().min(1, { message: 'Especifica la unidad (ej. piezas, cajas).' })
})

const RfqFormSchema = z.object({
    title: z.string().min(5, { message: 'El título debe tener al menos 5 caracteres.' }),
    description: z.string().min(20, { message: 'La descripción debe ser más detallada (min 20 caracteres).' }),
    budget: z.coerce.number().positive({ message: 'El presupuesto debe ser un número positivo.' }),
    deadline: z.string().min(1, { message: 'La fecha límite es obligatoria.' }).refine((val) => new Date(val) > new Date(), { message: 'La fecha límite debe ser en el futuro.' }),
    deliveryLocation: z.string().optional(),
    paymentTerms: z.nativeEnum(PaymentTerms).optional(),
    category: z.nativeEnum(RfqCategory).optional(),
    items: z.array(RfqItemSchema).min(1, { message: 'Debes incluir al menos un producto a cotizar.' })
})

type RfqFormValues = z.infer<typeof RfqFormSchema>

const STEPS = [
    { id: 1, title: 'Información General', icon: FileText, description: 'Descripción y presupuesto' },
    { id: 2, title: 'Productos Requeridos', icon: ShoppingCart, description: 'Ítems y cantidades' },
    { id: 3, title: 'Condiciones Comerciales', icon: Settings2, description: 'Plazos y términos de pago' },
]

/**
 * Página cliente para crear una nueva Solicitud de Cotización (RFQ).
 * Incluye Asistente Nexus IA para autocompletar requerimientos desde texto libre.
 * REGLA DE NEGOCIO: El comprador NO asigna plazo de entrega; son los proveedores quienes lo colocan en su propuesta.
 */
export default function CreateRfqPage() {
    const [isPending, setIsPending] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(1)

    // AI Assistant State
    const [aiPrompt, setAiPrompt] = useState('')
    const [isAiStructuring, setIsAiStructuring] = useState(false)
    const [aiMessage, setAiMessage] = useState<string | null>(null)
    const [showAiBox, setShowAiBox] = useState(false)

    const form = useForm<RfqFormValues>({
        resolver: zodResolver(RfqFormSchema) as any,
        defaultValues: {
            title: '',
            description: '',
            budget: 0,
            deadline: '',
            deliveryLocation: '',
            items: [{ name: '', quantity: 1, unit: 'Piezas' }]
        }
    })

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control as any,
        name: "items"
    })

    async function handleAutoStructureWithAi() {
        if (!aiPrompt || aiPrompt.trim().length < 8) {
            setAiMessage('Ingresa al menos unas cuantas palabras o lista de productos.')
            return
        }
        setIsAiStructuring(true)
        setAiMessage(null)

        try {
            const res = await autoStructureRfq(aiPrompt)
            if (res.success && res.data) {
                const { title, description, budget, category, items } = res.data

                if (title) form.setValue('title', title)
                if (description) form.setValue('description', description)
                if (budget) form.setValue('budget', Number(budget))
                if (category) form.setValue('category', category as RfqCategory)
                
                if (Array.isArray(items) && items.length > 0) {
                    replace(items.map((it: any) => ({
                        name: it.name || 'Producto sin nombre',
                        quantity: Number(it.quantity) || 1,
                        unit: it.unit || 'Piezas'
                    })))
                }

                setAiMessage('¡Licitación estructurada exitosamente por Nexus IA!')
                setShowAiBox(false)
            } else {
                setAiMessage(res.message || 'No se pudo estructurar el requerimiento.')
            }
        } catch (err) {
            setAiMessage('Error procesando el requerimiento con IA.')
        } finally {
            setIsAiStructuring(false)
        }
    }

    async function onSubmit(data: RfqFormValues) {
        setIsPending(true)
        setServerError(null)

        const parsedData = {
            ...data,
            deadline: new Date(data.deadline)
        }

        const result = await createRfq(undefined, parsedData)

        if (result?.message) {
            setServerError(result.message)
        }

        setIsPending(false)
    }

    // Validate current step before advancing
    const validateAndNext = async () => {
        let fieldsToValidate: (keyof RfqFormValues)[] = []
        
        if (currentStep === 1) {
            fieldsToValidate = ['title', 'description', 'budget', 'category']
        } else if (currentStep === 2) {
            fieldsToValidate = ['items']
        }

        const isValid = await form.trigger(fieldsToValidate as any)
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, 3))
        }
    }

    return (
        <div className="flex-1 p-6 md:p-10 xl:p-14 max-w-5xl w-full mx-auto">
            {/* Page Header */}
            <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <p className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.1em] mb-0.5">Gestión de Compras</p>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">
                        Nueva Solicitud de Cotización
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
                        Describe tus requerimientos para recibir propuestas competitivas en Guatemala.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => setShowAiBox(!showAiBox)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-11 px-5 rounded-xl shadow-md shadow-blue-600/20 cursor-pointer shrink-0"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {showAiBox ? 'Ocultar Asistente IA' : 'Asistir con Nexus IA'}
                </Button>
            </header>

            {/* AI Assistant Drawer Card */}
            {showAiBox && (
                <div className="mb-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
                            <Wand2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">Asistente de Autocompletado con IA</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Pega las especificaciones de tu pedido o escribe tu necesidad de compra informal.</p>
                        </div>
                    </div>

                    <Textarea
                        rows={3}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ejemplo: Necesito cotización para 20 computadoras de escritorio i7 con 16GB RAM y 10 monitores de 24 pulgadas para nuestra oficina en Guatemala, presupuesto aproximado de Q 95,000."
                        className="bg-white dark:bg-slate-900 rounded-xl border-blue-200 dark:border-blue-900/50 text-sm font-medium"
                    />

                    <div className="flex items-center justify-between pt-1">
                        <Button
                            type="button"
                            onClick={handleAutoStructureWithAi}
                            disabled={isAiStructuring}
                            className="bg-blue-600 hover:bg-blue-700 font-bold h-10 px-6 rounded-xl cursor-pointer text-xs"
                        >
                            {isAiStructuring ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analizando Requerimiento...</>
                            ) : (
                                <><Sparkles className="w-4 h-4 mr-2" /> Estructurar Formulario con IA</>
                            )}
                        </Button>
                        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Calcula partidas, cantidades e importe estimado</span>
                    </div>

                    {aiMessage && (
                        <p className={`text-xs font-bold ${aiMessage.includes('exitosamente') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {aiMessage}
                        </p>
                    )}
                </div>
            )}

            {/* Step Indicator */}
            <div className="mb-10">
                <div className="flex items-center justify-between max-w-2xl">
                    {STEPS.map((step, idx) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (step.id < currentStep) setCurrentStep(step.id)
                                    }}
                                    className={`
                                        w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all cursor-default
                                        ${currentStep === step.id
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : currentStep > step.id
                                            ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 cursor-pointer'
                                            : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-600'
                                        }
                                    `}
                                >
                                    {currentStep > step.id ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </button>
                                <p className={`mt-2 text-[0.65rem] font-bold text-center max-w-[100px] ${
                                    currentStep === step.id ? 'text-blue-600 dark:text-blue-400' : 
                                    currentStep > step.id ? 'text-slate-700 dark:text-slate-300' :
                                    'text-slate-400 dark:text-slate-500'
                                }`}>
                                    {step.title}
                                </p>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 mt-[-20px] transition-colors ${
                                    currentStep > step.id ? 'bg-blue-400 dark:bg-blue-600' : 'bg-slate-200 dark:bg-white/10'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit as any)}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                    
                    {/* STEP 1: General Info */}
                    {currentStep === 1 && (
                        <div className="p-8 md:p-10 space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5 font-outfit">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-black">1</div>
                                    Información General
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-[42px]">Datos básicos de su solicitud.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Título de la Solicitud <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="title" 
                                        placeholder="Ej: Suministro de Equipos de Cómputo Portátiles" 
                                        className="h-12 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-medium text-sm"
                                        {...form.register('title')} 
                                    />
                                    {form.formState.errors.title && <p className="text-xs text-red-500 font-bold">{form.formState.errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Descripción Detallada <span className="text-red-500">*</span></Label>
                                    <Textarea 
                                        id="description" 
                                        placeholder="Incluya especificaciones técnicas, modelo deseado, estándares de calidad y condiciones de inspección..." 
                                        className="min-h-[140px] rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-medium text-sm resize-none"
                                        {...form.register('description')} 
                                    />
                                    {form.formState.errors.description && <p className="text-xs text-red-500 font-bold">{form.formState.errors.description.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Categoría</Label>
                                        <Select onValueChange={(val) => form.setValue('category', val as RfqCategory)} value={form.watch('category')}>
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800 font-medium">
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TECH">Tecnología y Equipo</SelectItem>
                                                <SelectItem value="OFFICE">Suministros de Oficina</SelectItem>
                                                <SelectItem value="CONSTRUCTION">Construcción y Materiales</SelectItem>
                                                <SelectItem value="SERVICES">Servicios Profesionales</SelectItem>
                                                <SelectItem value="OTHER">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="budget" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Presupuesto Máximo (Q) <span className="text-red-500">*</span></Label>
                                        <Input 
                                            id="budget" 
                                            type="number" 
                                            step="0.01" 
                                            className="h-12 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-medium text-sm"
                                            {...form.register('budget')} 
                                        />
                                        {form.formState.errors.budget && <p className="text-xs text-red-500 font-bold">{form.formState.errors.budget.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Items */}
                    {currentStep === 2 && (
                        <div className="p-8 md:p-10 space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5 font-outfit">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-black">2</div>
                                        Productos y Cantidades
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-[42px]">Agrega los ítems específicos que requieres cotizar.</p>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => append({ name: '', quantity: 1, unit: 'Piezas' })} 
                                    className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-blue-600 dark:text-blue-400 text-xs"
                                >
                                    <Plus className="h-4 w-4 mr-1.5" /> Agregar Ítem
                                </Button>
                            </div>

                            {form.formState.errors.items?.message && (
                                <div className="flex items-center gap-2 p-3 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>{form.formState.errors.items.message as string}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="group relative bg-slate-50/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                                        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-blue-600 text-white text-[0.6rem] font-bold rounded-md uppercase tracking-wider">
                                            Ítem {index + 1}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-2">
                                            <div className="md:col-span-5 space-y-1.5">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Producto / Servicio</Label>
                                                <Input 
                                                    className="h-11 rounded-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium text-xs" 
                                                    placeholder="Ej: Computadora Portátil Intel i7 16GB RAM" 
                                                    {...form.register(`items.${index}.name` as const)} 
                                                />
                                                {form.formState.errors.items?.[index]?.name && (
                                                    <p className="text-xs text-red-500 font-bold">{form.formState.errors.items[index].name.message}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-3 space-y-1.5">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cantidad</Label>
                                                <Input 
                                                    type="number" 
                                                    className="h-11 rounded-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium text-xs" 
                                                    {...form.register(`items.${index}.quantity` as const)} 
                                                />
                                                {form.formState.errors.items?.[index]?.quantity && (
                                                    <p className="text-xs text-red-500 font-bold">{form.formState.errors.items[index].quantity.message}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-3 space-y-1.5">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unidad</Label>
                                                <Input 
                                                    className="h-11 rounded-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium text-xs" 
                                                    placeholder="Ej: Piezas, Lotes, Cajas" 
                                                    {...form.register(`items.${index}.unit` as const)} 
                                                />
                                                {form.formState.errors.items?.[index]?.unit && (
                                                    <p className="text-xs text-red-500 font-bold">{form.formState.errors.items[index].unit.message}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-1 flex justify-end pt-6">
                                                {fields.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => remove(index)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                                        title="Eliminar ítem"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Conditions */}
                    {currentStep === 3 && (
                        <div className="p-8 md:p-10 space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5 font-outfit">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-black">3</div>
                                    Condiciones Comerciales
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-[42px]">Fechas límite y condiciones de entrega.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="deadline" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Fecha Límite para Recibir Ofertas <span className="text-red-500">*</span></Label>
                                        <Input 
                                            id="deadline" 
                                            type="datetime-local" 
                                            className="h-12 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-medium text-sm"
                                            {...form.register('deadline')} 
                                        />
                                        {form.formState.errors.deadline && <p className="text-xs text-red-500 font-bold">{form.formState.errors.deadline.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="deliveryLocation" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Lugar de Entrega Requerido</Label>
                                        <Input 
                                            id="deliveryLocation" 
                                            placeholder="Ej: Zona 10, Ciudad de Guatemala" 
                                            className="h-12 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-medium text-sm"
                                            {...form.register('deliveryLocation')} 
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Nota sobre el Plazo de Entrega:</p>
                                    <p>El tiempo de entrega no es asignado por el comprador en esta etapa. Serán los proveedores los encargados de especificar su mejor tiempo de entrega en su cotización para su evaluación comparativa.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        {currentStep > 1 ? (
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                                className="rounded-xl border-slate-200 dark:border-slate-800 font-bold h-11 px-5 text-xs"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Paso Anterior
                            </Button>
                        ) : <div />}

                        {currentStep < 3 ? (
                            <Button 
                                type="button" 
                                onClick={validateAndNext}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl text-xs cursor-pointer"
                            >
                                Siguiente Paso <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                disabled={isPending}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-8 rounded-xl text-xs cursor-pointer shadow-md shadow-emerald-600/20"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Publicar Licitación
                            </Button>
                        )}
                    </div>
                </div>
            </form>

            {serverError && (
                <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/50 flex gap-3 items-center text-xs font-bold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{serverError}</p>
                </div>
            )}
        </div>
    )
}
