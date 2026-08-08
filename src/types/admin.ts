export interface Client {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  date_of_birth: string | null
  state_of_residence: string | null
  status: 'active' | 'inactive' | 'pending'
}

export interface IntakeSubmission {
  id: string
  created_at: string
  full_name: string
  date_of_birth: string | null
  email: string
  phone: string
  state_of_residence: string | null
  conditions: string[]
  medications: string | null
  allergies: string | null
  goals: string | null
  symptoms: Record<string, number>
  consent_acknowledged: boolean
  contact_consent: boolean
  e_signature: string | null
  stripe_session_id: string
  stripe_payment_status: string
  intake_fee_cents: number
  client_id: string | null
}

export interface ClientNote {
  id: string
  created_at: string
  client_id: string
  author_id: string | null
  author_name: string
  body: string
}

export interface ClientMessage {
  id: string
  created_at: string
  client_id: string
  sender: 'admin' | 'client'
  author_name: string
  body: string
  read_at: string | null
}

export interface ClientProtocol {
  id: string
  created_at: string
  client_id: string
  protocol_id: string
  protocol_name: string
  status: 'active' | 'paused' | 'completed'
  notes: string | null
  assigned_by: string | null
}

export interface Appointment {
  id: string
  created_at: string
  client_id: string
  admin_id: string | null
  start_time: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  reason: string | null
}

export interface AppointmentWithClient extends Appointment {
  clients: Pick<Client, 'id' | 'full_name'> | null
}
