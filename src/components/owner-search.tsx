import { useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { supabase } from "@/utils/supabase"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Owner {
  id: string
  full_name: string
  phone_number: string
}

interface OwnerSearchProps {
  onSelect: (ownerId: string) => void
  disabled?: boolean
}

export function OwnerSearch({ onSelect, disabled }: OwnerSearchProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOwners = async (searchStr: string) => {
    if (searchStr.length < 2) return
    setLoading(true)

    const { data, error } = await supabase
      .from("owners")
      .select("id, full_name, phone_number")
      .ilike("full_name", `%${searchStr}%`) // Search by name
      .limit(5)

    if (!error && data) setOwners(data)
    setLoading(false)
    console.log("Fetched owners:", data, "Error:", error)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-11 w-full justify-between border-none bg-slate-50 px-3 font-normal hover:bg-slate-100"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="size-4 text-slate-400" />
            {value
              ? owners.find((o) => o.id === value)?.full_name
              : "Search for an owner..."}
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] bg-white p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type name to search..."
            onValueChange={fetchOwners}
          />
          <CommandList>
            {loading && (
              <div className="p-4 text-center text-xs">Searching...</div>
            )}
            <CommandEmpty>No owner found.</CommandEmpty>
            <CommandGroup>
              {owners.map((owner) => (
                <CommandItem
                  key={owner.id}
                  value={owner.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onSelect(currentValue)
                    setOpen(false)
                  }}
                  className="flex flex-col items-start gap-0.5"
                >
                  <div className="flex w-full items-center justify-between font-bold">
                    {owner.full_name}
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        value === owner.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {owner.phone_number}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
