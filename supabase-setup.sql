-- Crear tabla para la lista de espera
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de perfiles de usuario
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para waitlist
CREATE POLICY "Anyone can insert their email" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view waitlist (admin only in production)" ON waitlist
  FOR SELECT USING (false); -- Cambiar a true para admin en producción

-- Políticas de seguridad para perfiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Crear función para actualizar el timestamp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Opcional: Crear vista para estadísticas
CREATE VIEW waitlist_stats AS
SELECT 
  COUNT(*) as total_subscribers,
  DATE(created_at) as subscription_date,
  COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_subscribers
FROM waitlist 
GROUP BY DATE(created_at)
ORDER BY subscription_date DESC;
