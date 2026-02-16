import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colori, Tipografia } from "../../../core/theme/theme";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";

// Mappa colori per tipo (stessi di ElementoRichiesta)
const COLORI_TIPO: Record<string, string> = {
  Ferie: "#6BCB77",
  "Permesso studio": "#7A5AF8",
  "Visita medica": "#4D9DE0",
  "Permesso 104": "#F59E0B",
  "Congedo genitoriale": "#F4B4D6",
  "Permesso matrimoniale": "#FF6B6B",
  Malattia: "#FF6B6B",
  Permesso: "#4D9DE0",
  Assenza: Colori.primario,
};
const getColoreTipo = (label: string): string => {
  return COLORI_TIPO[label] ?? Colori.primario;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const stripTime = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const calcolaGiornate = (inizio: Date, fine: Date) => {
  const start = stripTime(inizio).getTime();
  const end = stripTime(fine).getTime();
  const diff = Math.max(end - start, 0);
  return Math.max(1, Math.round(diff / MS_PER_DAY) + 1);
};

const normalizzaTipo = (tipo?: string) => {
  const t = (tipo || "ferie").toLowerCase();
  if (t.includes("ferie")) return "Ferie";
  if (t.includes("studio")) return "Permesso studio";
  if (t.includes("visita")) return "Visita medica";
  if (t.includes("l104")) return "Permesso 104";
  if (t.includes("genitoriale")) return "Congedo genitoriale";
  if (t.includes("matrimon")) return "Permesso matrimoniale";
  if (t.includes("malatt")) return "Malattia";
  if (t.includes("permess")) return "Permesso";
  return "Assenza";
};

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const adjustedEnd = startAngle === endAngle ? endAngle + 0.0001 : endAngle;
  const start = polarToCartesian(cx, cy, r, adjustedEnd);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = adjustedEnd - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

type Props = {
  richieste: RichiestaFerie[];
  inCaricamento?: boolean;
};

type Slice = {
  label: string;
  value: number;
  color: string;
};

export default function GraficoAssenze({ richieste, inCaricamento }: Props) {
  const slices: Slice[] = useMemo(() => {
    if (!richieste || richieste.length === 0) return [];
    const bucket = new Map<string, number>();

    richieste.forEach((req) => {
      const label = normalizzaTipo(req.tipo_permesso);
      const giorni = calcolaGiornate(req.data_inizio, req.data_fine);
      bucket.set(label, (bucket.get(label) || 0) + giorni);
    });

    return Array.from(bucket.entries()).map(([label, value]) => ({
      label,
      value,
      color: getColoreTipo(label), // ← usa il colore per tipo invece dell'indice
    }));
  }, [richieste]);

  const totale = useMemo(
    () => slices.reduce((acc, slice) => acc + slice.value, 0),
    [slices],
  );

  const archi = useMemo(() => {
    let start = 0;
    return slices.map((slice) => {
      const sweep = totale > 0 ? (slice.value / totale) * 360 : 0;
      const end = start + sweep;
      const path = sweep === 0 ? "" : describeArc(90, 90, 80, start, end);
      const percentuale = totale > 0 ? (slice.value / totale) * 100 : 0;
      start = end;
      return { ...slice, path, percentuale };
    });
  }, [slices, totale]);

  return (
    <View style={stili.card}>
      <View style={stili.header}>
        <Text style={stili.titolo}>Distribuzione assenze</Text>
        {inCaricamento ? (
          <ActivityIndicator size="small" color={Colori.primario} />
        ) : null}
      </View>

      {totale === 0 ? (
        <Text style={stili.testoVuoto}>
          Nessuna assenza da mostrare. Invia una richiesta per vedere il
          grafico.
        </Text>
      ) : (
        <View style={stili.contenuto}>
          <Svg width={180} height={180} viewBox="0 0 180 180">
            {archi.map((slice) => (
              <Path key={slice.label} d={slice.path} fill={slice.color} />
            ))}
          </Svg>

          <View style={stili.legenda}>
            {archi.map((slice) => (
              <View style={stili.rigaLegenda} key={slice.label}>
                <View
                  style={[stili.boxColore, { backgroundColor: slice.color }]}
                />
                <View style={stili.testiLegenda}>
                  <Text style={stili.etichetta}>{slice.label}</Text>
                  <Text style={stili.valore}>
                    {slice.value} giorn{slice.value === 1 ? "o" : "i"} ·{" "}
                    {slice.percentuale.toFixed(0)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const stili = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderColor: "#f0f0f0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titolo: {
    fontSize: Tipografia.dimensione.lg,
    fontWeight: Tipografia.peso.grassetto,
    color: Colori.testoPrimario,
  },
  contenuto: {
    flexDirection: "row",
    alignItems: "center",
  },
  legenda: {
    flex: 1,
    marginLeft: 12,
  },
  rigaLegenda: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  boxColore: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 10,
  },
  testiLegenda: {
    flexShrink: 1,
  },
  etichetta: {
    fontSize: Tipografia.dimensione.md,
    color: Colori.testoPrimario,
  },
  valore: {
    fontSize: Tipografia.dimensione.sm,
    color: Colori.testoSecondario,
  },
  testoVuoto: {
    color: Colori.testoSecondario,
    fontSize: Tipografia.dimensione.md,
  },
});
